import type { PortfolioItem } from "@/types";
import { CORE_TATTOOS } from "./tattoos/core";
import { SPIRITUAL_TATTOOS } from "./tattoos/spiritual";
import { REALISM_TATTOOS } from "./tattoos/realism";
import { FINE_LINE_TATTOOS } from "./tattoos/fineLine";
import { MANDALA_TATTOOS } from "./tattoos/mandala";
import { JAPANESE_TATTOOS } from "./tattoos/japanese";
import { POP_TATTOOS } from "./tattoos/pop";

export { CORE_TATTOOS } from "./tattoos/core";
export { SPIRITUAL_TATTOOS } from "./tattoos/spiritual";
export { REALISM_TATTOOS } from "./tattoos/realism";
export { FINE_LINE_TATTOOS } from "./tattoos/fineLine";
export { MANDALA_TATTOOS } from "./tattoos/mandala";
export { JAPANESE_TATTOOS } from "./tattoos/japanese";
export { POP_TATTOOS } from "./tattoos/pop";

export const INITIAL_TATTOOS: PortfolioItem[] = [
  ...CORE_TATTOOS,
  ...SPIRITUAL_TATTOOS,
  ...REALISM_TATTOOS,
  ...FINE_LINE_TATTOOS,
  ...MANDALA_TATTOOS,
  ...JAPANESE_TATTOOS,
  ...POP_TATTOOS,
];