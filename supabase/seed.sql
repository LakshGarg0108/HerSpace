-- Her Safe Space — Seed Data
-- Provides initial pre-prepared comforting reminders for onboarding

-- Note: In production Supabase, seed data is linked to authenticated user accounts or system defaults.
-- These sample entries demonstrate the structure and initial comforting notes.

-- Sample helper function to populate initial reminders for a new user
CREATE OR REPLACE FUNCTION public.seed_user_initial_reminders(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.personal_reminders (user_id, title, message, category, is_pinned, author_type)
    VALUES
        (target_user_id, 'One Moment at a Time', 'You don''t have to figure everything out today. Let''s take this one moment at a time.', 'Overwhelm', true, 'creator'),
        (target_user_id, 'Permission to Rest', 'It''s okay to take a break. The world will keep turning while you gather your breath.', 'Burnout', true, 'creator'),
        (target_user_id, 'You Deserve Kindness', 'You deserve to be treated with kindness, especially by the voice inside your own head.', 'Self-Worth', false, 'creator'),
        (target_user_id, 'Your Feelings are Real', 'You don''t need to explain everything for your feelings to matter. What hurts, hurts.', 'Validation', false, 'creator'),
        (target_user_id, 'Family Complexity', 'You are not responsible for fixing adults or carrying emotional atmospheres that were not yours to create.', 'Family', true, 'creator'),
        (target_user_id, 'Smallest Next Step', 'Take things one small step at a time. Drink a sip of water. Unclench your jaw. You''re doing okay.', 'Grounding', false, 'creator')
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
