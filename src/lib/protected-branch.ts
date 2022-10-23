const protectedNames = ['main', 'master', 'staging', 'production'];

export function isProtected(name: string) {
   return protectedNames.includes(name);
}
