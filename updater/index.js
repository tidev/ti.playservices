/**
 * Axway Appcelerator Titanium - ti.playservices
 * Copyright (c) 2018-2019 by Axway. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const repository = 'https://mvnrepository.com/artifact/com.google.android.gms';

// obtain list from repository
async function getList (url) {
    const options = {
        uri: url,
        transform: (body) => {
            return cheerio.load(body);
        }
    };
    let list = [];
    await rp(options)
        .then(async ($) => {

            // get libraries
            $('.im-title').each((i, element) => {
                const href = $(element.children[1]).attr('href').split('/')[1];
                list.push(href);
            });

            // navigate to next page
            const next = $('.search-nav').children().last();
            if (!next.hasClass('current')) {
                const nextPage = next.children().last().attr('href');
                list = list.concat(await getList(repository + nextPage));
            }
        });

    return list;
}

// obtain latest version of library
async function getLatestVersion (url) {
    const options = {
        uri: url,
        transform: (body) => {
            return cheerio.load(body);
        }
    };
    let version = undefined;
    await rp(options)
        .then(async ($) => {
            $('.release').each((i, element) => {
                const href = $(element).attr('href').split('/')[1];
                version = href;
                return false;
            });
        });

    return version;
}

// obtain list of files
async function getFiles (url, filter) {
    const options = {
        uri: url,
        transform: (body) => {
            return cheerio.load(body);
        }
    };
    let list = [];
    await rp(options)
        .then(async ($) => {
            $('.vbtn').each((i, element) => {
                const href = $(element).attr('href');
                if (href) {
                    const type = href.split('.').pop();
                    if (filter) {
                        if (filter.includes(type)) {
                            list.push(href);
                        }
                    } else {
                        list.push(href);
                    }
                }
            });
        });

    return list;
}

(async function () {

    console.log(`Obtaining latest Play Services libraries...`);

    // obtain Google Play Services repository libraries
    const libraries = await getList(repository);
    const blacklist = [ 'play-services-contextmanager' ];

    for (const library of libraries) {

        // filter valid libraries
        if (library.startsWith('play-') && !blacklist.includes(library)) {

            // obtain latest version of library
            const version = await getLatestVersion(repository + '/' + library);

            // obtain library .aar
            const archives = await getFiles(repository + '/' + library + '/' + version, 'aar');
            for (const aar of archives) {

                console.log(`  ${library}-${version}`);

                // download aar
                rp(aar).pipe(fs.createWriteStream(`../android/lib/${library}-${version}.aar`));
            }
        }
    }
})();