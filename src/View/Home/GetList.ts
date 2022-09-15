/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import axios from 'axios'
import fetch from "node-fetch";
import { ext_id } from './HomeGreeting';
const fs = require('fs')
// const countries = ['US', 'AE', 'AR', 'AT', 'AU', 'BE', 'BG', 'BH', 'BR', 'CA', 'CH', 'CL', 'CN', 'CO', 'CZ', 'DE', 'DK', 'DZ', 'EG', 'ES', 'GB', 'GR', 'FI', 'FR', 'HK', 'HU', 'ID', 'IE', 'IL', 'IN', 'IT', 'JO', 'JP', 'KR', 'KW', 'LB', 'MO', 'LT', 'LV', 'MY', 'MX', 'NL', 'NO', 'NZ', 'OM', 'PH', 'PL', 'PT', 'QA', 'RO', 'RU', 'SA', 'SE', 'SG', 'SK', 'SZ', 'TH', 'TN', 'TR', 'TW', 'UA', 'VN', 'ZA']
const countries = ['US', 'AE', 'AR', 'AT', 'AU', 'BE', 'BG'];


// test
// getDownloads 1469128755
// getDownloads 1207654602
// getDownloads 1207654606
// getDownloads 1233855546
// getDownloads 1217962058
// getDownloads 1219672617
// getDownloads 1350155743
// getDownloads 1186270102

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function innerFunction(id, downloads, delayms, ctx?) {
    // получаем дату
    const nowdate = new Date(Date.now() - 86400000 * 2)
    const date = `${nowdate.getFullYear().toString()}-${(nowdate.getMonth() + 1).toString().padStart(2, '0')}-${(nowdate.getDate()).toString().padStart(2, '0')}`;

    // Временный массив    
    var result: string = ``
    var nulledRatings = []
    // Перебираем страны
    const options = {
        method: 'GET',
        url: `https://api.appfollow.io/api/v2/meta/ratings?ext_id=${id.id}&country=${downloads.country.toLowerCase()}&date=${date}&type=total`,
        headers: {
            "Accept": "application/json",
            "X-AppFollow-API-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGl2MiIsInN1YiI6NTM2NzMsImp0aSI6NDEsInNjb3BlcyI6ImRydyJ9.4JCXQL5LZY1ihkSL_WNg-juQMMhs9k_VDfmFDxc0ZBA"
        }
    };

    await delay(delay).then(async () => {
        await ctx.reply(`${id.name}(${id.id}) — ${downloads.country} Считаю, сколько нужно добавить`)
        // @ts-ignore
        await axios(options)
            .then(async res => {
                if (res.data.ratings.list[0]) {
                    if ((res.data.ratings.list[0].stars_total == 0)) {

                        // console.log('Need one 5 rating')
                        // console.log('Общее количество нужных звезд: 1')

                    } else if (res.data.ratings.list[0].rating < 4.7) {
                        // console.log(res.data.ratings.list[0])
                        let item = res.data.ratings.list[0]
                        let counter = 0
                        let data = await howMuchNeedAddStars(item, counter)

                        // console.log(`
                        //     ID Приложения: ${id}\n
                        //     Страна       : ${countries[i].toLocaleLowerCase()}
                        //     Дата         : ${date}
                        //     Общее количество звёзд: ${item.stars_total}
                        //     Средний рейтинг: ${item.rating}
                        //     Чтобы средний рейтинг превысил 4.7 нужно долить: ${data}
                        // `)

                        // @ts-ignore
                        result = `${downloads.country.toLowerCase()} — (${downloads.count}) — ${item.rating} — +${data}`

                    }
                } else {
                    result = `is has't stars`
                }
            })
            .catch(async (err) => {
                await ctx.reply(`Возникла ошибка при получении рейтингов у ${id.name}(${id.id})`)
                fs.writeFile("hello.txt", err, function (error) {

                    if (error) throw error; // если возникла ошибка
                    console.log("Асинхронная запись файла завершена. Содержимое файла:");
                    let data = fs.readFileSync("hello.txt", "utf8");
                    console.log(data);  // выводим считанные данные
                });
                return await innerFunction(id, downloads, 15000, ctx)
            })
    })
    return result
}
export async function getList(id, ctx?) {
    return await delay(1000).then(async () => {
        return await ctx.reply(`Получение информации по ${id.id}(${id.name})`).then(async () => {

            let result: any = []

            // id приложения
            for (let i = 0; i < countries.length; i++) {
                await delay(14000).then(async () => {
                    return await getDownloadsFromCountry(id, countries[i], ctx).then(async downloads => {
                        if (downloads) {
                            if (downloads.count > 50) {
                                await ctx.reply(`Загрузок у ${id.id}(${id.name}) — ${downloads.country} > 50 (${downloads.count})`)

                                await innerFunction(id, downloads, 5000, ctx).then(async (data) => {
                                    if (data) {
                                        await ctx.reply(data)
                                        // return data
                                        result.push(data)
                                    } else {
                                        console.log(data)
                                        console.log('null')
                                    }
                                })
                            }
                        }
                    })
                })
            }

            return result

        })
    })

}

async function howMuchNeedAddStars(item, counter) {


    counter++
    let total = (item.stars1 + 2 * item.stars2 + 3 * item.stars3 + 4 * item.stars4 + 5 * item.stars5 + counter) / item.stars_total

    // console.log(total)

    if (total <= 4.7) {
        // console.log(counter)
        return howMuchNeedAddStars(item, counter)
    } else {
        return counter
    }

}

// test
// getDownloads 1469128755
// getDownloads 1207654602
// getDownloads 1207654606
// getDownloads 1233855546
// getDownloads 1217962058
// getDownloads 1219672617
// getDownloads 1350155743
// getDownloads 1186270102
// (async () => {
//     await getDownloads(1219672617)
//     await getDownloads(1350155743)
// })();

async function getDownloads(id, ctx?) {

    const nowdate = new Date(Date.now())
    let current_month = nowdate.getMonth() + 1
    let current_year = nowdate.getFullYear()

    let temp_date = new Date(Date.now() - (86400000 * 30))
    // 29, 30, 31 Последний День текущего месяца
    let lastday_of_current_month = new Date(current_year, current_month, 1)

    let to = `${current_year}-${current_month.toString().padStart(2, '0')}-${nowdate.getDate()}`
    let from = `${current_year}-${(temp_date.getMonth() + 1).toString().padStart(2, '0')}-${temp_date.getDate()}`
    // console.log('from: ' + from)
    // console.log('to: ' + to)

    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-AppFollow-API-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGl2MiIsInN1YiI6NTM2NzMsImp0aSI6NDEsInNjb3BlcyI6ImRydyJ9.4JCXQL5LZY1ihkSL_WNg-juQMMhs9k_VDfmFDxc0ZBA'
        }
    };

    return fetch(`https://api.appfollow.io/api/v2/reports/aso?ext_id=${id}&channel=summary&from=${from}&to=${to}&period=monthly`, options)
        .then(response => response.json())
        .then(async response => {

            if (response) {
                if (response.detail) {
                    try {
                        return response.detail
                        // await ctx.reply(response.detail)
                    } catch (err) {
                        console.log(err)
                        // console.log(response.detail)
                        return err
                    }
                }
            }

            if (response) {
                if (response.total) {
                    // console.log(response.total)
                    if (response.total[0]) {
                        if (response.total[0].units) {
                            if (response.total[0].units < 50) {
                                return false
                            } else {
                                // console.log(response.total[0].units)
                                return response.total[0].units
                            }
                        }

                    }
                }
            }
        })
        .catch(err => console.error(err));
}

// ; (async (ctx) => {
//     for (let z = 0; z < ext_id.length; z++) {
//         for (let i = 0; i < countries.length; i++) {
//             console.log(countries[i])
//             console.log(ext_id[z])
//             return await delay(1000).then(async () => {
//                 const downloads: number = await getDownloadsFromCountry(ext_id[z], countries[i], ctx)
//                 console.log(downloads)
//             })
//         }
//     }
// })();

async function getDownloadsFromCountry(id, country, ctx?) {

    const nowdate = new Date(Date.now())
    let current_month = nowdate.getMonth() + 1
    let current_year = nowdate.getFullYear()

    let temp_date = new Date(Date.now() - (86400000 * 30))
    // 29, 30, 31 Последний День текущего месяца
    let lastday_of_current_month = new Date(current_year, current_month, 1)

    let to = `${current_year}-${current_month.toString().padStart(2, '0')}-${nowdate.getDate()}`
    let from = `${current_year}-${(temp_date.getMonth() + 1).toString().padStart(2, '0')}-${temp_date.getDate()}`


    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-AppFollow-API-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGl2MiIsInN1YiI6NTM2NzMsImp0aSI6NDEsInNjb3BlcyI6ImRydyJ9.4JCXQL5LZY1ihkSL_WNg-juQMMhs9k_VDfmFDxc0ZBA'
        }
    };


    console.log(id)
    console.log(country)
    return fetch(`https://api.appfollow.io/api/v2/meta/downloads/revenue?ext_id=${id.id}&country=${country.toLowerCase()}&from=${from}&to=${to}&page=1`, options)
        .then(response => response.json())
        .then(async response => {

            let downloads = {
                country: country.toLowerCase(),
                count: 0
            }

            if (response) {
                console.log(response)
                for (let l = 0; l < response.metrics.list.length; l++) {
                    downloads.count += response.metrics.list[l].total_downloads
                }
                return downloads
                // if (response.detail) {
                //     console.log(response.detail)
                //     try {
                //         return response.detail
                //         // await ctx.reply(response.detail)
                //     } catch (err) {
                //         console.log(err)
                //         // console.log(response.detail)
                //         return err
                //     }
                // }
            }

            // if (response) {
            //     if (response.total) {
            //         // console.log(response.total)
            //         if (response.total[0]) {
            //             if (response.total[0].units) {
            //                 if (response.total[0].units < 50) {
            //                     console.log(`App = ${id.name} Загрузок меньше чем 50 в ${country} ${response.total[0].units}`)
            //                     return false
            //                 } else {
            //                     console.log(`App = ${id.name} Загрузок в ${country} ${response.total[0].units}`)
            //                     return response.total[0].units
            //                 }
            //             }

            //         }
            //     }
            // }
        })
        .catch(err => console.error(err));
}

export { countries }
