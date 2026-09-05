import { useState } from "react";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import UpdatePassword from "./UpdatePassword";
const sections = {
  Profile,
  "Update Profile": UpdateProfile,
  "Update Password": UpdatePassword,
};
export default function Account() {
  const [selected, setSelected] = useState("Profile");
  const Section = sections[selected];
  return (
    <main className="p-5 sm:pl-20 min-h-screen">
      <h1 className="text-3xl mb-6">Settings</h1>
      <div className="grid md:grid-cols-[180px_1fr] gap-6 max-w-6xl mx-auto">
        <nav
          aria-label="Account settings"
          className="glass rounded-xl p-4 flex flex-col gap-4 h-fit"
        >
          {Object.keys(sections).map((name) => (
            <button
              key={name}
              type="button"
              aria-current={selected === name ? "page" : undefined}
              className={
                selected === name
                  ? "text-primary font-semibold text-left"
                  : "text-left text-muted-foreground"
              }
              onClick={() => setSelected(name)}
            >
              {name}
            </button>
          ))}
        </nav>
        <Section />
      </div>
    </main>
  );
}
