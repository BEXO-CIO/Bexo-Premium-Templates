import { useEffect } from "react";
import { useDisplayProfile } from "../../utils/profileHelper";

/**
 * Hire Me is a shared ATS page hosted by the BEXO web app.
 * From a template origin we redirect to the platform Hire Me route.
 */
const HireMeRedirect = () => {
  const { profile } = useDisplayProfile();
  const handle = profile?.handle;

  useEffect(() => {
    if (!handle) return;

    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // When served via subdomain proxy, go to the main web app hire-me route
    const webOrigin = isLocal
      ? "http://localhost:5173"
      : `${window.location.protocol}//mybexo.com`;

    window.location.replace(`${webOrigin}/hire-me/${encodeURIComponent(handle)}`);
  }, [handle]);

  return (
    <div className="page" style={{ padding: "8rem 2rem", textAlign: "center" }}>
      <p>Opening Hire Me profile…</p>
    </div>
  );
};

export default HireMeRedirect;
