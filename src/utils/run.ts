export function run(main: () => void) {
  process.argv.forEach((process) => {
    const [key, value] = process.split('=');
    if (key === 'mode' && value === 'dev') main();
  });
}
