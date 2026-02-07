export default function ColorDiversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-blue-50">
      {children}
    </div>
  );
}
