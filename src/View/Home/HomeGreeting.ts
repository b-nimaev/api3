import { MyContext } from "../../Model/Model"

const ext_id = [
    { id: 1158906956, name: "deals [yelllow]" },
    { id: 1163778886, name: "airlines [green]" }
]

// const ext_id = [
//     { id: 1158906956, name: "deals [yelllow]" },
//     { id: 1163778886, name: "airlines [green]" },
//     { id: 1163778491, name: "flights [blue]" },
//     { id: 1186268152, name: "arabic1 [orange]" },
//     { id: 1186268161, name: "arabic2 [green]" },
//     { id: 1496543830, name: "flycheap [violet]" },
//     { id: 1366971136, name: "korea" },
//     { id: 1530862640, name: "fiklo [yellow]" },
//     { id: 1454924106, name: "budget [dark + green]" },
//     { id: 1462826468, name: "arabic4 [dark]" },
//     { id: 1469128755, name: "israel" },
//     { id: 1207654602, name: "rewardblock = fly cheap [green]" },
//     { id: 1207654606, name: "screenshots = cheap flights [orange]" },
//     { id: 1233855546, name: "lowcost" },
//     { id: 1217962058, name: "rewarded = star flights [orange]" },
//     { id: 1219672617, name: "brazil" },
//     { id: 1350155743, name: "arabic3 [light green]" },
//     { id: 1186270102, name: "australia" },
//     { id: 1350249160, name: "taiwan" },
//     { id: 1570981480, name: "usa fly chep = expedia" }
// ]

export async function greeting(ctx: MyContext) {

    let extra = {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[
                {
                    'text': 'Получить данные',
                    'callback_data': 'fetch_data'
                }
            ]]
        }
    }
    // console.log(extra.reply_markup.inline_keyboard)
    // @ts-ignore
    ctx.reply(`Найдено ${ext_id.length} приложений`, extra)

}

export { ext_id }