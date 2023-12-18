import data from '../../src/data/projects.json';
import {a} from "vite-node/types-516036fa";

export default defineSitemapEventHandler(async (e) => {
    // Fetch every project showed and then create a beautiful sitemaps 🐹

    let posts:Array<any> = [];
    for (const project of data.data) {
        posts.push({
            _path: '/project/'+project.id,
            modifiedAt: new Date()
        })
    }

    return posts.map((p) => {
        return {
            loc: p._path,
            lastmod: p.modifiedAt,
        };
    });
});
