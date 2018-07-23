import * as Nightmare from 'nightmare';

export const findNumberRegexp = "[+-]?([0-9]+([.|,][0-9]*)?|[.|,][0-9]+)";

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
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function scrollDown(nm: Nightmare, {selector = null,count = 0,previousHeight = -1, currentHeight = 0, maxIterationsCount = 1} = {}) {
	return new Promise<Nightmare>((resolve,reject) =>{
		if (previousHeight !== currentHeight && maxIterationsCount--) {
			console.log(previousHeight, maxIterationsCount)
			previousHeight = currentHeight;

			return nm.evaluate(function (selector,count) {
				if(selector){
					let prevCount = count;
					count = document.querySelectorAll(selector).length;
                    if(count == prevCount){
						return { currentHeight: document.body.scrollHeight, count, isEnd: true};
					}
				}
				return { currentHeight: document.body.scrollHeight, count, isEnd: false};
			},selector,count)
			.then(({currentHeight,count,isEnd}) => {
				if(isEnd){
					resolve(nm);
				}
				resolve(scrollDown(
					nm.scrollTo(currentHeight, 0).wait(3000),
					{
						previousHeight,
						currentHeight,
						maxIterationsCount,
						selector,
						count
					}
				));
			});
		}
		return resolve(nm);
	});
};