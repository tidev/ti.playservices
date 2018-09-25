/**
 * Axway Appcelerator Titanium - ti.playservices
 * Copyright (c) 2018 by Axway. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const repository = 'http://repo.spring.io/plugins-release/com/google/android/gms/';

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
        .then(($) => {
            $('a').each((i, element) => {
                const href = $(element).attr('href');
                if (href != '../') {
                    list.push(href);
                }
            });
        });

    return list;
}

(async function () {

    // obtain Google Play Services repository libraries
    const libraries = await getList(repository);

    for (const library of libraries) {

        // filter valid libraries
        if (library.startsWith('play-')) {

            // obtain versions of library
            const versions = await getList(repository + library);

            // determine latest version
            let latest;
            let latestNumeric;
            for (const version of versions) {
                
                const segments = version.replace('/', '').split('.');
                let expandedVersion = '';
                for (let segment of segments) {
                    while (segment.length <= 3) {
                        segment = '0' + segment;
                    }
                    expandedVersion += segment;
                }
                let numeric = parseInt(expandedVersion);
                
                // have we found a later version?
                if (!latestNumeric || latestNumeric < numeric) {
                    latestNumeric = numeric;
                    latest = version;
                }
            }

            // if we have found a library, download the latest version
            if (latest) {
                const files = await getList(repository + library + latest);

                for (const file of files) {

                    // only download Android Archive
                    if (file.endsWith('.aar')) {
                        rp(repository + library + latest + file).pipe(fs.createWriteStream('../android/lib/' + file));
                        console.log(file);
                    }
                }
            }
        }
    }
})();