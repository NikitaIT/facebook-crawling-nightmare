import * as Nightmare  from "nightmare";
/**
 * Личная страница https://www.facebook.com/checkpoint/block/
 */
const config = {
    ErrorPage:{
        nextBtn: `#checkpointSubmitButton`,
        prevBtn: `#checkpointSecondaryButton`,
        Step1: {
            exists: `form.checkpoint`,
            selector: "form.checkpoint"
        },
        Step2: {
            wait: `input[placeholder="Enter number"]`,
            insert: {
                selector: `input[placeholder="Enter number"]`,
                phone: 9215647156
            }
        },
        Step3: {
            warning: {
                selector: "form.checkpoint",
                pattern: /Warning/i
            },
            wait: `input[placeholder="Enter code"]`,
            insert: {
                selector: `input[placeholder="Enter code"]`,
                code: 537663 //каждый запрос до первого входа один и тот же код We've sent a six-digit code 
            }
        },
        Step4: {
            insert: {
                selector: ``,
                photo: "href"
            }
           
        },
        Step5: {}
    }
}
export const solveCheckpointBlock = (errorPage: Nightmare) => 
    (new Promise( (resolve,reject) => errorPage
        .exists( config.ErrorPage.Step1.exists )
        .then(isOk => {
             if(isOk){
                errorPage.end();//пока что пусть так
                errorPage.evaluate((config)=>{
                    return  (_=>_ && _.textContent || "Неизвестная ошибка")
                            (document.querySelector(config.ErrorPage.Step1.selector));
                },config)
                .then((errorText)=>{
                    console.error(errorText);

                    errorPage
                        .click(config.ErrorPage.nextBtn)
                        .wait(config.ErrorPage.Step2.wait)
                        .insert(config.ErrorPage.Step2.insert.selector, config.ErrorPage.Step2.insert.phone.toString())
                        .click(config.ErrorPage.nextBtn)
                        .wait(config.ErrorPage.Step3.wait)
                        .insert(config.ErrorPage.Step3.insert.selector, config.ErrorPage.Step3.insert.code.toString())
                        .click(config.ErrorPage.nextBtn)
                        .evaluate((config)=>{
                            return  (_=>_ && _.textContent.match(config.ErrorPage.Step3.warning.pattern)[1])
                                    (document.querySelector(config.ErrorPage.Step3.warning.selector));
                        },config)
                        .then((isError) => {
                            if(isError){
                                console.error("ErrorPage.Step3");
                                resolve();
                            }else{
                                errorPage
                                    .insert(config.ErrorPage.Step4.insert.selector, config.ErrorPage.Step4.insert.photo.toString())
                                    .click(config.ErrorPage.nextBtn)
                                    .wait(config.ErrorPage.nextBtn)
                                    .click(config.ErrorPage.nextBtn)
                                    .then(()=>resolve())
                                    .catch(console.error)
                                    .finally(() => reject());
                            }
                        })
                        .catch(console.error)
                        .finally(() => reject());
                })
                .catch(console.error)
                .finally(() => reject());
             }
             return errorPage;
        })
        .then(resolve)
        .catch(console.error)
        .finally(() => reject())
    ));
        