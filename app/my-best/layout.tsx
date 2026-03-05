export default function MyBestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
