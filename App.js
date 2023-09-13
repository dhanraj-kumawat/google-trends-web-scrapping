const express = require("express");
const request = require("request-promise");
const cheerio = require("cheerio");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());


// 
async function googleTrends(){
    let packages = [];
    const html = await request.get("https://trends.google.com/trends/trendingsearches/daily?geo=IN&hl=en-US");
    const $ = cheerio.load(html);
    
    $("div.details-wrapper").map((index,element) =>{
        const title = $(element).find("div.details > div.details-top > div.title > span > a").text();
        const searches = $(element).find("div.visible > ng-include> div.search-count > div.search-count-title").text();
        // console.log(searches);
        // console.log("ok");
        const x= $.text();
        const package = {
            title: title,
            
            searches: searches
        }
        packages.push(package);
    }).get();
    return packages;
}


async function main(){
    googleTrends();
}

app.get("/",(req,res) => {
    res.send(" google trends api");
})

app.get("/today",async (req,res) => {
    try{
        const packages = await googleTrends();
        res.json(packages);
    }
    catch(error){
        res.json(error);
    }
})


app.listen(PORT,() => console.log(`Server running on port ${PORT}`));