import * as Nightmare from 'nightmare';

export function scrollDown(
	nm: Nightmare, 
	{
		selector = null,
		maxSelectorIterationsCount = 10,
		selectorIterationsCount = 10,
		previousSelectorIterationsCount = 10,
		count = 0,
		previousHeight = -1, 
		currentHeight = 0, 
		maxIterationsCount = 1
	} = {}): Promise<Nightmare> {
	return new Promise<Nightmare>((resolve,reject) =>{
		if (previousHeight !== currentHeight && maxIterationsCount--) {
			console.log(previousHeight, maxIterationsCount)
			previousHeight = currentHeight;

		return nm.evaluate(function (selector) {
				return { currentHeight: document.body.scrollHeight, currentCount: document.querySelectorAll(selector).length};
			},selector)
			.then(({currentHeight,currentCount}) => {
				
				if(selector){
					let prevCount = count;
					count = currentCount;
					if(count === prevCount){
						selectorIterationsCount--;
						if(selectorIterationsCount === 0)
							resolve(nm);
					}
					if(selectorIterationsCount === previousSelectorIterationsCount)
						selectorIterationsCount = maxSelectorIterationsCount;
				}
				previousSelectorIterationsCount = selectorIterationsCount;
				console.log({
					previousHeight,
					currentHeight,
					maxIterationsCount,
					selector,
					count,
					maxSelectorIterationsCount,
					previousSelectorIterationsCount,
					selectorIterationsCount
				})

				resolve(scrollDown(
					nm.scrollTo(currentHeight, 0).wait(3000),
					{
						previousHeight,
						currentHeight,
						maxIterationsCount,
						selector,
						count,
						maxSelectorIterationsCount,
						previousSelectorIterationsCount,
						selectorIterationsCount
					}
				));
			});
		}
		return resolve(nm);
	});
};
class TNightmareResponseBody {
	nightmare: Nightmare;
	isOk: boolean;
	status?: number;
	constructor(nightmare: Nightmare,isOk: boolean,status?: number) {
		this.nightmare = nightmare;
		this.isOk = isOk;
		this.status = status;
	}
}
export type TNightmareResponse = Promise<TNightmareResponseBody>;

const clickAndWaitIfExists = (nightmare: Nightmare) => async (selector: string, timeout: number = 2000): TNightmareResponse => {
	return (await nightmare
		.wait(timeout)
		.exists(selector)
		.then<TNightmareResponseBody>(isOk => new TNightmareResponseBody(nightmare, isOk)) 
		&& nightmare.click(selector).wait(timeout).exists(selector).then<TNightmareResponseBody>(isOk => new TNightmareResponseBody(nightmare, isOk))
	);
};
export const clickSafe = (nightmare: Nightmare) => async (selector: string, timeout: number = 2000): TNightmareResponse => {
    const response = await clickAndWaitIfExists(nightmare)(selector,timeout);
	if(!response.isOk){
		return Promise.reject(new Error(`${selector} не найден!`))
	}
    return response;
}