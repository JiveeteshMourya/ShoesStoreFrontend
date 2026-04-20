export default function SourcePill({ sources }) {
  if (!sources) return null;

  const match = sources.match(/\[Source:\s*([^\]]+)\]/);
  const filename = match ? match[1] : null;
  if (!filename) return null;

  return <span className="text-xs text-gray-400 mt-1 block">📄 from: {filename}</span>;
}
