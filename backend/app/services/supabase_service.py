import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from ..core.config import settings

class StorageService:
    def __init__(self):
        # In-memory storage partitioned by user_id for demo/test mode
        self._profiles: Dict[str, Dict[str, Any]] = {}
        self._moods: Dict[str, List[Dict[str, Any]]] = {}
        self._journal: Dict[str, List[Dict[str, Any]]] = {}
        self._conversations: Dict[str, List[Dict[str, Any]]] = {}
        self._messages: Dict[str, List[Dict[str, Any]]] = {}
        self._reminders: Dict[str, List[Dict[str, Any]]] = {}

        self._seed_initial_reminders("demo-user-id")

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _seed_initial_reminders(self, user_id: str):
        seeds = [
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "title": "One Moment at a Time",
                "message": "You don't have to figure everything out today. Let's take this one moment at a time.",
                "category": "Overwhelm",
                "is_pinned": True,
                "author_type": "creator",
                "created_at": self._now(),
                "updated_at": self._now(),
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "title": "Permission to Rest",
                "message": "It's okay to take a break. The world will keep turning while you gather your breath.",
                "category": "Burnout",
                "is_pinned": True,
                "author_type": "creator",
                "created_at": self._now(),
                "updated_at": self._now(),
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "title": "Family Complexity",
                "message": "You are not responsible for fixing adults or carrying emotional atmospheres that were not yours to create.",
                "category": "Family",
                "is_pinned": True,
                "author_type": "creator",
                "created_at": self._now(),
                "updated_at": self._now(),
            },
        ]
        self._reminders[user_id] = seeds

    # PROFILE
    def get_profile(self, user_id: str, email: str) -> Dict[str, Any]:
        if user_id not in self._profiles:
            self._profiles[user_id] = {
                "id": user_id,
                "email": email,
                "display_name": email.split("@")[0].capitalize(),
                "created_at": self._now(),
                "updated_at": self._now(),
            }
        return self._profiles[user_id]

    def update_profile(self, user_id: str, display_name: str) -> Dict[str, Any]:
        if user_id not in self._profiles:
            self._profiles[user_id] = {
                "id": user_id,
                "email": f"{user_id}@hersafespace.app",
                "display_name": display_name,
                "created_at": self._now(),
            }
        self._profiles[user_id]["display_name"] = display_name
        self._profiles[user_id]["updated_at"] = self._now()
        return self._profiles[user_id]

    # MOODS
    def get_moods(self, user_id: str) -> List[Dict[str, Any]]:
        return self._moods.get(user_id, [])

    def create_mood(self, user_id: str, mood: str, note: Optional[str] = None) -> Dict[str, Any]:
        entry = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "mood": mood,
            "note": note,
            "created_at": self._now(),
        }
        if user_id not in self._moods:
            self._moods[user_id] = []
        self._moods[user_id].insert(0, entry)
        return entry

    def delete_mood(self, user_id: str, mood_id: str) -> bool:
        user_list = self._moods.get(user_id, [])
        before_len = len(user_list)
        self._moods[user_id] = [m for m in user_list if m["id"] != mood_id]
        return len(self._moods[user_id]) < before_len

    # JOURNAL
    def get_journal(self, user_id: str) -> List[Dict[str, Any]]:
        return self._journal.get(user_id, [])

    def get_journal_entry(self, user_id: str, entry_id: str) -> Optional[Dict[str, Any]]:
        for entry in self._journal.get(user_id, []):
            if entry["id"] == entry_id:
                return entry
        return None

    def create_journal_entry(self, user_id: str, title: str, content: str, mood: Optional[str]) -> Dict[str, Any]:
        entry = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title or "",
            "content": content,
            "mood": mood,
            "created_at": self._now(),
            "updated_at": self._now(),
        }
        if user_id not in self._journal:
            self._journal[user_id] = []
        self._journal[user_id].insert(0, entry)
        return entry

    def update_journal_entry(
        self, user_id: str, entry_id: str, title: Optional[str], content: Optional[str], mood: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        for entry in self._journal.get(user_id, []):
            if entry["id"] == entry_id:
                if title is not None:
                    entry["title"] = title
                if content is not None:
                    entry["content"] = content
                if mood is not None:
                    entry["mood"] = mood
                entry["updated_at"] = self._now()
                return entry
        return None

    def delete_journal_entry(self, user_id: str, entry_id: str) -> bool:
        user_list = self._journal.get(user_id, [])
        before = len(user_list)
        self._journal[user_id] = [e for e in user_list if e["id"] != entry_id]
        return len(self._journal[user_id]) < before

    # REMINDERS
    def get_reminders(self, user_id: str) -> List[Dict[str, Any]]:
        if user_id not in self._reminders:
            self._seed_initial_reminders(user_id)
        return self._reminders.get(user_id, [])

    def create_reminder(
        self, user_id: str, title: str, message: str, category: Optional[str] = "General", is_pinned: bool = False
    ) -> Dict[str, Any]:
        reminder = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "message": message,
            "category": category or "General",
            "is_pinned": is_pinned,
            "author_type": "personal",
            "created_at": self._now(),
            "updated_at": self._now(),
        }
        if user_id not in self._reminders:
            self._reminders[user_id] = []
        self._reminders[user_id].insert(0, reminder)
        return reminder

    def update_reminder(
        self, user_id: str, reminder_id: str, title: Optional[str], message: Optional[str], category: Optional[str], is_pinned: Optional[bool]
    ) -> Optional[Dict[str, Any]]:
        for r in self._reminders.get(user_id, []):
            if r["id"] == reminder_id:
                if title is not None:
                    r["title"] = title
                if message is not None:
                    r["message"] = message
                if category is not None:
                    r["category"] = category
                if is_pinned is not None:
                    r["is_pinned"] = is_pinned
                r["updated_at"] = self._now()
                return r
        return None

    def delete_reminder(self, user_id: str, reminder_id: str) -> bool:
        user_list = self._reminders.get(user_id, [])
        before = len(user_list)
        self._reminders[user_id] = [r for r in user_list if r["id"] != reminder_id]
        return len(self._reminders[user_id]) < before

    # ACCOUNT DELETION
    def delete_all_user_data(self, user_id: str):
        self._profiles.pop(user_id, None)
        self._moods.pop(user_id, None)
        self._journal.pop(user_id, None)
        self._conversations.pop(user_id, None)
        self._messages.pop(user_id, None)
        self._reminders.pop(user_id, None)

storage = StorageService()
