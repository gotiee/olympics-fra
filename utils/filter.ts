export async function filterDisiplines(data: any, filter: string) {
  const lowerFilter = filter.toLocaleLowerCase();
  return data
    .filter(({ name }: { name: any }) =>
      name.toLocaleLowerCase().startsWith(lowerFilter)
    )
    .slice(0, 20)
    .map(({ name, id }: { name: any; id: any }) => ({
      value: id,
      label: `${name}`,
    }));
}
