const Kernel5D5 = ([a, b, c, d, f]: number[] = []) => {
  const kernel = [
    [f, d, c, d, f],
    [d, c, b, c, d],
    [c, b, a, b, c],
    [d, c, b, c, d],
    [f, d, c, d, f],
  ];

  return kernel;
};

const Kernel6D5 = ([a, b, c, d, e, f]: number[] = []) => {
  const kernel = [
    [f, e, d, e, f],
    [e, c, b, c, e],
    [d, b, a, b, d],
    [e, c, b, c, e],
    [f, e, d, e, f],
  ];

  return kernel;
};

const Kernel4D7 = ([a, b, c, d]: number[] = []) => {
  const kernel = [
    [d, d, d, c, d, d, d],
    [d, c, c, c, c, c, d],
    [d, c, b, b, b, c, d],
    [d, c, b, a, b, c, d],
    [d, c, b, b, b, c, d],
    [d, c, c, c, c, c, d],
    [d, d, d, c, d, d, d],
  ];

  return kernel;
};

const Kernel8D7 = ([a, b, c, d, e, f, g, h]: number[] = []) => {
  const kernel = [
    [h, g, f, e, f, g, h],
    [g, f, e, d, e, f, g],
    [f, e, c, b, c, e, f],
    [e, d, b, a, b, d, e],
    [f, e, c, b, c, e, f],
    [g, f, e, d, e, f, g],
    [h, g, f, e, f, g, h],
  ];

  return kernel;
};

const Kernel4D10 = ([d, c, b, a]: number[] = []) => {
  const kernel = [
    [d, d, d, d, d, d, d, d, d, d],
    [d, d, c, c, c, c, c, c, d, d],
    [d, c, c, b, b, b, b, c, c, d],
    [d, c, b, b, a, a, b, b, c, d],
    [d, c, b, a, a, a, a, b, c, d],
    [d, c, b, a, a, a, a, b, c, d],
    [d, c, b, b, a, a, b, b, c, d],
    [d, c, c, b, b, b, b, c, c, d],
    [d, d, c, c, c, c, c, c, d, d],
    [d, d, d, d, d, d, d, d, d, d],
  ];

  return kernel;
};
