export function findEndSubstring(array: string[], startWith: string): string | undefined {
	return (array.find(x => x.includes(startWith)) as string || "").slice(startWith.length).replace(/\r?\n/g, "");
}
export const getBase64Image = (img: HTMLImageElement) => {
	// создаем канвас элемент  
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;

	// Копируем изображение на канвас  
	const ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	// Получаем data-URL отформатированную строку  
	// Firefox поддерживает PNG и JPEG.   
	const dataURL = canvas.toDataURL("image/png");

	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

export const chainPromiseFn = (actions: (() => Promise<any>)[]): Promise<any> => {
	let chain = Promise.resolve(() => Promise.resolve()) as any;
	let results: any[] = [];
	//LifeEvents,ContactandBasicInfo,
	[...actions, () => "end"]
		.map((e: () => Promise<any>) => {
			chain = chain.then((past: () => Promise<any>) => {
				return past().then((data: any) => {
					results.push(data);
					return () => e();
				});
			});
		});
	return chain.then(()=> results)
}