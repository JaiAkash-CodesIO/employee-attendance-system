type Props = {
  employeeId: string;
};

export default function ProfileCard({ employeeId }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold mb-4">
        Employee Profile
      </h2>

      <div className="space-y-2">

        <p>
          <strong>ID:</strong> {employeeId}
        </p>

        <p>
          <strong>Name:</strong> Jai Akash
        </p>

        <p>
          <strong>Email:</strong> jaiakash@example.com
        </p>

        <p>
          <strong>Department:</strong> Software Development
        </p>

        <p>
          <strong>Role:</strong> Software Engineer
        </p>

      </div>
    </div>
  );
}