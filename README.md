# Warm Media

## التشغيل المحلي

1. أنشئ مشروعًا في Supabase.
2. انسخ `.env.example` إلى `.env.local` وأضف URL وAnon Key فقط للواجهة.
3. نفّذ `supabase/COMPLETE_DATABASE.sql` في SQL Editor.
4. نفّذ `npm install`.
5. نفّذ `npm run dev`.
6. افتح `http://localhost:3000`.

## Supabase

- أنشئ حسابين إداريين من لوحة Supabase Auth، ثم أضفهما إلى `admin_roles`.
- لا تستخدم `SUPABASE_SERVICE_ROLE_KEY` داخل المتصفح.
- فعّل Realtime لجداول `chat_messages` و`notifications`.

## الملفات المهمة

- مخطط قاعدة البيانات: `supabase/COMPLETE_DATABASE.sql`
- مخطط إضافي: `supabase/schema.sql`
- متغيرات البيئة: `.env.example`
