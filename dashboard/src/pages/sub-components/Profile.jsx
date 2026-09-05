import { useSelector } from "react-redux";
import { profileFields, profileValues } from "@/lib/profile-fields";
export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const values = profileValues(user);
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-bold">Profile</h1>
      {user.avatar?.url && (
        <img src={user.avatar.url} alt="Profile" className="w-64 rounded-2xl" />
      )}
      {user.resume?.url && (
        <a
          href={user.resume.url}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          View resume
        </a>
      )}
      <dl className="grid gap-4">
        {profileFields.map(({ key, label }) => (
          <div key={key}>
            <dt className="font-semibold">{label}</dt>
            <dd className="whitespace-pre-line break-words text-muted-foreground">
              {values[key] || "Not provided"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
