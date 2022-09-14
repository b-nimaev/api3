import { Composer, Scenes } from "telegraf";
import { MyContext } from "../../Model/Model";
import { getList, countries } from "./GetList";
import { greeting } from "./HomeGreeting";

import { ext_id } from './HomeGreeting'

require("dotenv").config();

const handler = new Composer<MyContext>(); // function
const home = new Scenes.WizardScene(
    "home",
    handler
);
home.leave(async (ctx) => console.log("home leave"))
home.start(async (ctx) => greeting(ctx));

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

async function gedataHandler(ctx) {

    await ctx.answerCbQuery()
    await ctx.editMessageText("Получаю данные...")

    let message = ``

    for (let z = 0; z < ext_id.length; z++) {
        console.log(`${z} App`)
        message += `\n${ext_id[z].id} - ${ext_id[z].name}\n`

        await delay(5000).then(async () => {
            console.log(`#${z} App`)
            await getList(ext_id[z], ctx)
                .then(result => {
                    if (!result) {
                        console.log('1')
                        message += `Не указаны рейтинги\n`
                    } else if (typeof (result) === 'string') {
                        console.log('2')
                        message += `${result}\n`
                    } else {
                        console.log('3')
                        for (let i = 0; i < result.length; i++) {
                            message += `${result[i]}\n`
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        })
    }

    await ctx.reply('🚀')
    await ctx.reply('Данные получены!')
    await ctx.reply(message)

    // console.log(ctx.update.callback_query)
    // let arr = await getList(current, ctx)

    let result = ''

    // if (arr) {
    // arr.forEach(element => {
    // result += element + '\n'
    // })
    // } else {
    // return ctx.reply('Загрузок меньше 50')
    // }

    // let message = `<b>${ext_id[id].name}(${id})</b> \n${result}`
    // await ctx.reply(message, { parse_mode: 'HTML' })

}

async function counter(z, item) {

    z = z + 1

    let temp: number

    if (item.stars_total !== 0) {
        temp = (item.stars1 + 2 * item.stars2 + 3 * item.stars3 + 4 * item.stars4 + 5 * (item.stars5 + z)) / 2

        console.log("temp: " + temp)
        console.log("current z: " + z)
        if (temp <= 4.7) {
            // console.log('Всё ещё меньше')
            return counter(z, item)
        } else {
            console.log(temp + " temp more than 4.7")
            return z
        }

    } else {
        return 5
    }
}

async function getAvgRatings(list) {

    let tempArray = []

    for (let i = 0; i < list.length; i++) {
        let item = list[i]
        await counter(0, item)
    }

    return tempArray

}

home.action('fetch_data', async (ctx) => await gedataHandler(ctx))


export default home