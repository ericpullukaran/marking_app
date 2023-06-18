export const cx = (...classes: (string | boolean | null | undefined)[]) =>
  classes.filter((cls) => typeof cls === "string").join(" ");
