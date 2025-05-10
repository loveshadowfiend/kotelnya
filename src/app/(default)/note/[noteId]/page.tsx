export default async function NotePage({
  params,
}: {
  params: { noteId: string };
}) {
  const { noteId } = await params;

  return <main></main>;
}
