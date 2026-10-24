const pieces = [
  { file: 2, left: 0, top: 11.1, width: 26.8227, height: 1.78827 },
  { file: 3, left: 1.3, top: 13.7, width: 10.3456, height: 10.3127 },
  { file: 4, left: 15.1, top: 0.1, width: 10.3856, height: 10.2993 },
  { file: 5, left: 15.1, top: 13.7, width: 10.3167, height: 10.2514 },
  { file: 6, left: 1.4, top: 0, width: 10.39, height: 10.3063 },
];

/** Original Figma vector pieces, kept in their original 26.8 × 24 slot. */
export function ScanMark() {
  return (
    <span className="relative block h-6 w-[26.8227px]" aria-hidden="true">
      {pieces.map((piece) => (
        <img
          key={piece.file}
          src={`/assets/figma/mobile-vector${piece.file}.svg`}
          width={piece.width}
          height={piece.height}
          alt=""
          className="absolute"
          style={{ left: piece.left, top: piece.top }}
        />
      ))}
    </span>
  );
}
