import logging
from typing import List, Dict, Tuple
from ..core.config import settings
from ..schemas.chat import SupportMode, ChatHistoryItem

logger = logging.getLogger("her_safe_space.ai")

SYSTEM_PROMPT_CORE = """
You are the empathetic AI Companion for "Her Safe Space"—a digital sanctuary for a young woman or girl navigating emotional distress, family complexities, burnout, and quiet overwhelm.
Your foundational motto: "You don't have to be okay all the time."

CORE BEHAVIORAL DIRECTIVES:
1. ALWAYS acknowledge and gently hold her feelings before any reflection.
2. Be warm, gentle, and profoundly human without sounding robotic, scripted, or cliché.
3. Ask at most ONE gentle question at a time. Never interrogate or bombard her.
4. Respect her boundaries: if she doesn't want to explain details, honor that completely.
5. In family situations: avoid assumptions about family members or their intentions. Never blame her or others. Never push for confrontation or drastic ultimatums.
6. AVOID toxic positivity: do NOT say "everything happens for a reason," "just smile," or pressure her to feel better quickly.
7. BOUNDARIES & ETHICS:
   - You are NOT a doctor, therapist, or crisis service.
   - NEVER diagnose any mental health condition.
   - NEVER claim that you are the only one who understands her or encourage emotional dependence on you.
   - Gently encourage connection with trusted friends, counselors, or safe adults when appropriate.
"""

MODE_PROMPTS: Dict[SupportMode, str] = {
    SupportMode.LISTEN: """
CURRENT MODE: LISTEN.
The user wants to express her feelings freely WITHOUT receiving advice.
- Do NOT give advice, bullet points, or action items.
- Focus purely on reflecting what she feels, offering a listening presence, and letting her vent.
- E.g.: "That sounds so deeply exhausting to carry alone. I'm right here listening. Take all the time you need."
""",
    SupportMode.COMFORT: """
CURRENT MODE: COMFORT.
The user wants reassurance, validation, and kind words.
- Reassure her that she is not broken, that her emotional pain makes sense, and that she is worthy of kindness.
- Offer grounding warmth and patience.
""",
    SupportMode.CALM_DOWN: """
CURRENT MODE: CALM DOWN.
The user feels overwhelmed, panicky, or overstimulated.
- Keep sentences short, slow, and soothing.
- Offer a soft 4-6 breath or sensory grounding cue.
- Help de-escalate physiological tension: remind her to unclench her jaw and drop her shoulders.
""",
    SupportMode.THINK_IT_THROUGH: """
CURRENT MODE: THINK IT THROUGH.
The user wants help untangling a messy situation.
- Help separate facts (what happened) from interpretations, feelings, and uncertainties.
- Gently ask what feels within her personal control right now, versus what belongs to other people.
- Help identify one tiny, manageable next step.
""",
}

FALLBACK_DEMO_RESPONSES: Dict[SupportMode, List[str]] = {
    SupportMode.LISTEN: [
        "I'm right here with you. Thank you for trusting this space with what's on your mind. Please take all the time you need—I'm simply listening, with no pressure and no expectations.",
        "That sounds like an immense amount of weight to carry on your own. I hear you, and you don't have to explain or justify any of it to me. Keep letting it out if you wish.",
    ],
    SupportMode.COMFORT: [
        "I want you to know: you are not failing, even if today feels heavy and uncertain. It is so understandable that you feel worn down. Breathe gently right now. You are worthy of kindness.",
        "Your feelings make complete sense given everything you're experiencing. You don't have to be strong or have everything figured out today. I'm right here beside you.",
    ],
    SupportMode.CALM_DOWN: [
        "Let's pause together for just ten quiet seconds. Feel the solid ground beneath your feet, let your shoulders drop away from your ears, and take one slow breath in... and a gentle, long exhale out.",
        "When everything is loud and spinning inside, you don't have to fix anything right this second. Put one hand on your chest and feel the steady rhythm of your own heart.",
    ],
    SupportMode.THINK_IT_THROUGH: [
        "It makes complete sense that this feels tangled. Let's look at one small piece: What is one thing right now that you have direct control over, and what is one thing that belongs to someone else?",
        "When family or life circumstances feel overwhelming, breaking them down into tiny moments helps. If you could give yourself just one small grace today, what would that look like?",
    ],
}

DISTRESS_KEYWORDS = [
    "kill myself",
    "want to die",
    "suicide",
    "end my life",
    "self harm",
    "cutting myself",
    "can't go on",
    "cant go on",
    "hurt myself",
    "overdose",
]

def check_for_distress(text: str) -> bool:
    lower = text.lower()
    return any(keyword in lower for keyword in DISTRESS_KEYWORDS)

class AIService:
    def __init__(self):
        self._client = None
        if settings.is_openai_configured:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")

    async def generate_response(
        self,
        user_message: str,
        support_mode: SupportMode,
        history: List[ChatHistoryItem] = None,
    ) -> Tuple[str, bool, bool]:
        """
        Returns: (response_text, is_demo, safety_warning)
        """
        # 1. Distress Check
        if check_for_distress(user_message):
            safety_reply = (
                "I hear how deeply you are hurting right now, and I want you to know your life has immense value. "
                "Because I am an AI, I cannot keep you physically safe or provide medical care. "
                "Please let a trained, compassionate human hold this with you right now.\n\n"
                "Please reach out to a free, confidential 24/7 helpline immediately:\n"
                "• In India: Tele-MANAS at 14416 or Vandrevala Foundation at +91 9999 666 555\n"
                "• In North America: Call or text 988\n"
                "• In the UK: Call 111\n\n"
                "You can also click 'Get Help Now' in the top menu to view direct options. You do not have to carry this alone."
            )
            return safety_reply, False, True

        # 2. Live OpenAI Call if configured
        if self._client:
            try:
                system_instruction = f"{SYSTEM_PROMPT_CORE}\n{MODE_PROMPTS.get(support_mode, '')}"
                messages = [{"role": "system", "content": system_instruction}]

                if history:
                    for h in history[-6:]:
                        messages.append({"role": h.role, "content": h.content})

                messages.append({"role": "user", "content": user_message})

                response = self._client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=600,
                )

                reply_text = response.choices[0].message.content or ""
                return reply_text.strip(), False, False
            except Exception as e:
                logger.error(f"OpenAI completion error: {e}")
                # Fall through to transparent demo response

        # 3. Transparent Demo Mode Fallback
        pool = FALLBACK_DEMO_RESPONSES.get(support_mode, FALLBACK_DEMO_RESPONSES[SupportMode.LISTEN])
        import random
        demo_text = random.choice(pool)
        return demo_text, True, False

ai_service = AIService()
