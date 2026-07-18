-- Fadak Link Hub — single-table schema.
-- The whole site content (profile, socials, links, stats, settings)
-- lives in one JSONB row with id = 'main'.

create table if not exists public.linkhub (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Lock the table down: RLS enabled with NO policies means the publishable
-- (browser) key can neither read nor write. All access goes through the
-- server using the secret key, which bypasses RLS.
alter table public.linkhub enable row level security;

-- Seed row (only inserted if missing — safe to re-run).
insert into public.linkhub (id, data)
values (
  'main',
  '{
    "profile": {
      "name": "عطارية فدك",
      "handle": "Fadk1",
      "tagline": "أجود أنواع الأعشاب والعطارة الطبيعية",
      "location": "كركوك، العراق",
      "avatarUrl": ""
    },
    "socials": {
      "whatsapp": "https://wa.me/9647711911901",
      "tiktok": "https://www.tiktok.com/@fadk94",
      "facebook": "https://www.facebook.com/share/1BkyZZCW21/",
      "instagram": "https://www.instagram.com/faadak94",
      "maps": "https://goo.gl/maps/x3KhwjWnqVLY4ZS77"
    },
    "links": [
      {
        "id": "wa-main",
        "title": "واتساب — تواصل معنا",
        "subtitle": "اضغط لعرض جميع الأرقام",
        "url": "https://wa.me/9647711911901",
        "icon": "whatsapp",
        "enabled": true,
        "featured": true,
        "clicks": 0,
        "numbers": ["07711911901", "07751011911", "07751511911", "07751611911", "07751711911"]
      },
      {
        "id": "wa-owner",
        "title": "واتساب المالك — محمد عطار",
        "subtitle": "الرقم الشخصي لصاحب عطارية فدك",
        "url": "https://wa.me/9647725756958",
        "icon": "whatsapp",
        "enabled": true,
        "clicks": 0
      },
      {
        "id": "tt-main",
        "title": "تيك توك — الحساب الرئيسي",
        "subtitle": "@fadk94",
        "url": "https://www.tiktok.com/@fadk94",
        "icon": "tiktok",
        "enabled": true,
        "clicks": 0
      },
      {
        "id": "tt-2",
        "title": "تيك توك — الحساب الثاني",
        "subtitle": "@fadak51711911",
        "url": "https://www.tiktok.com/@fadak51711911",
        "icon": "tiktok",
        "enabled": true,
        "clicks": 0
      },
      {
        "id": "tt-3",
        "title": "تيك توك — الحساب الثالث",
        "subtitle": "@fadak77777",
        "url": "https://www.tiktok.com/@fadak77777",
        "icon": "tiktok",
        "enabled": true,
        "clicks": 0
      },
      {
        "id": "fb-main",
        "title": "فيسبوك",
        "subtitle": "صفحتنا الرسمية",
        "url": "https://www.facebook.com/share/1BkyZZCW21/",
        "icon": "facebook",
        "enabled": true,
        "clicks": 0
      },
      {
        "id": "ig-main",
        "title": "انستغرام",
        "subtitle": "@faadak94",
        "url": "https://www.instagram.com/faadak94",
        "icon": "instagram",
        "enabled": true,
        "clicks": 0
      },
      {
        "id": "map-main",
        "title": "موقعنا على الخريطة",
        "subtitle": "زورونا في كركوك",
        "url": "https://goo.gl/maps/x3KhwjWnqVLY4ZS77",
        "icon": "maps",
        "enabled": true,
        "clicks": 0
      }
    ],
    "stats": { "views": 0 },
    "settings": { "tiktokStyle": "separate" },
    "updatedAt": ""
  }'::jsonb
)
on conflict (id) do nothing;
