/**
 * Axway Appcelerator Titanium - ti.playservices
 * Copyright (c) 2018-2019 by Axway. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

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

/**
 * @param {string} repository maven repository to query
 */
async function gatherLibraries(repository) {
    console.log(`Obtaining latest Play Services libraries...`);

    // obtain Google Play Services repository libraries
    const libraries = await getList(repository);
    const blacklist = [
        'play-services-contextmanager',
        'play-services-measurement',
        'play-services-instantapps',
        'play-services-vision',
        'play-services-vision-common',
        'play-services-panorama',
        'play-services-drive',
        'play-services-plus',
        'play-services-safetynet',
        'play-services-wearable',
        'play-services-fitness',
        'play-services-games',
        'play-services-cast',
        'play-services-cast-framework',
        'play-services-appinvite',
        'play-services-appindexing',
        'play-services-all-wear',
        'play-services-fido',
        'play-services-gass',
        'play-services-tagmanager',
        'play-services-awareness',
        'play-services-clearcut',
        'play-services-ads-lite',
        'play-services-phenotype',
        'play-services-vision-image-label',
        'play-services-tagmanager-v4-impl',
        'play-services-tagmanager-api',
        'play-services-afs-native',
        'play-services'
    ];

    // filter valid libraries
    return libraries.filter(library => {
        return library.startsWith('play-') && !library.endsWith('license') && !blacklist.includes(library);
    });
}

/**
 * 
 * @param {string} destDir directory to place the downloaded AAR files
 * @param {string} repository name of maven repository
 * @param {string} library name of google library
 * @param {string} [version='latest'] version to download. defaults to 'latest'. 'latest' will grab latest from maven repository.
 */
async function downloadLibrary(destDir, repository, library, version = 'latest') {
    if (!version || version === 'latest') {
        // obtain latest version of library
        version = await getLatestVersion(`${repository}/${library}?repo=google`);
    }
        
    // obtain library .aar
    const archives = await getFiles(`${repository}/${library}/${version}`, 'aar');
    if (archives.length !== 1) {
        throw new Error(`Expected single URL to download library: ${library}/${version}, but got: ${archives}`);
    }
    console.log(`  ${library}-${version}`);
    // download aar
    return pipe(archives[0], path.join(destDir, `${library}-${version}.aar`));
}

/**
 * 
 * @param {string} url URL to download
 * @param {string} dest destination file path
 */
async function pipe(url, dest) {
    return new Promise((resolve, reject) => {
        const writable = fs.createWriteStream(dest);
        const readable = request(url).pipe(writable);
        writable.on('finish', () => resolve());
        readable.on('error', reject);
        writable.on('error', reject);
    });
}

(async function main() {
    const libraries = await gatherLibraries(repository);
    const destDir = path.join(__dirname, '../android/lib/');
    await fs.ensureDir(destDir);
    return Promise.all(libraries.map(l => downloadLibrary(destDir, repository, l)));
})();
