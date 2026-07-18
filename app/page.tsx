import { getStore } from "@/lib/store";
import type { LinkItem } from "@/lib/types";
import { Icon } from "@/components/icons";
import LinkCard from "@/components/LinkCard";
import TikTokGroup from "@/components/TikTokGroup";
import ShareButton from "@/components/ShareButton";
import ViewTracker from "@/components/ViewTracker";

export const dynamic = "force-dynamic";

type Row =
  | { kind: "link"; link: LinkItem }
  | { kind: "tiktok-group"; links: LinkItem[] };

export default async function PublicPage() {
  const store = await getStore();
  const enabled = store.links.filter((l) => l.enabled);
  const socials = (
    Object.entries(store.socials) as [string, string][]
  ).filter(([, url]) => url);

  // In "dropdown" mode, collapse all TikTok links into one expandable card
  // placed where the first TikTok link was.
  const tiktoks = enabled.filter((l) => l.icon === "tiktok");
  const groupTiktok =
    store.settings.tiktokStyle === "dropdown" && tiktoks.length > 1;
  const rows: Row[] = [];
  for (const link of enabled) {
    if (groupTiktok && link.icon === "tiktok") {
      if (link.id === tiktoks[0].id) {
        rows.push({ kind: "tiktok-group", links: tiktoks });
      }
      continue;
    }
    rows.push({ kind: "link", link });
  }

  return (
    <main className="public-shell">
      <div className="aurora" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <ViewTracker />

      <div className="phone-col">
        <header className="hero">
          <ShareButton name={store.profile.name} />

          <div className="avatar-wrap">
            <div className="avatar-ring" aria-hidden="true" />
            <div className="avatar">
              {store.profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={store.profile.avatarUrl} alt={store.profile.name} />
              ) : (
                <span className="monogram">فدك</span>
              )}
            </div>
          </div>

          <h1 className="store-name">
            {store.profile.name}
            <Icon name="verified" className="verified" />
          </h1>

          {store.profile.tagline ? (
            <p className="tagline">{store.profile.tagline}</p>
          ) : null}

          {store.profile.location ? (
            <p className="location">
              <Icon name="maps" />
              {store.profile.location}
            </p>
          ) : null}

          <div className="social-row">
            {socials.map(([key, url]) => (
              <a
                key={key}
                className="social-dot"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
              >
                <Icon name={key} />
              </a>
            ))}
          </div>
        </header>

        <section className="links">
          {rows.map((row, i) =>
            row.kind === "tiktok-group" ? (
              <TikTokGroup key="tiktok-group" links={row.links} index={i} />
            ) : (
              <LinkCard key={row.link.id} link={row.link} index={i} />
            )
          )}
        </section>

        {store.settings.ownerPhone ? (
          <p className="owner-line">
            الرقم الشخصي لصاحب المتجر {store.settings.ownerName} :{" "}
            <span className="owner-num">{store.settings.ownerPhone}</span>
          </p>
        ) : null}

        <footer className="foot">
          <span>
            © {new Date().getFullYear()} {store.profile.name}
          </span>
        </footer>
      </div>
    </main>
  );
}
