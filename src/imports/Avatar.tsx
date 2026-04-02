import imgAvatar from "figma:asset/f700c10be8e928d2c825e536435c89724d9f3fa1.png";

export default function Avatar() {
  return (
    <div className="relative size-full" data-name="Avatar">
      <div className="absolute left-0 size-[120px] top-0" data-name="avatar">
        <img alt="" className="absolute block max-w-none size-full" height="120" src={imgAvatar} width="120" />
      </div>
      <div className="absolute bg-[rgba(0,0,0,0.15)] left-0 rounded-[60px] size-[120px] top-0" />
    </div>
  );
}