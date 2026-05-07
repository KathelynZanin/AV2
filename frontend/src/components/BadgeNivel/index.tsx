import type { NivelPermissao } from "../../types";
import { getBadgeNivelStyle } from "../../utils";

type Props = {
  nivel: NivelPermissao;
};

export function BadgeNivel({ nivel }: Props) {
  const style = getBadgeNivelStyle(nivel);
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        ...style,
      }}
    >
      {nivel}
    </span>
  );
}