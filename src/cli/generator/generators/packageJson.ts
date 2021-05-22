export const generate = () => {
  const packageJson = {
    name: ".kryptonstudio-ecs-client",
    version: "1.0.0",
    license: "MIT"
  }

  return JSON.stringify(packageJson, undefined, 2);
};