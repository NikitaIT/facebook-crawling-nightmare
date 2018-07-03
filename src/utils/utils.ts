function findEndSubstring(array: string[], startWith: string) : string | undefined {
	return (array.find( x => x.includes(startWith) ) as string || "").slice(startWith.length).replace(/\r?\n/g, "");
}