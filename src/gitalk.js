var http = require('https');
var qs = require('querystring')
const create = async function (options = { title, label, accessToken, repo, owner }) {
    const postData = `{
        "labels": ["Gitalk",\"${options.label}\"],
        "title": \"${options.title}\"
    }`;

    const params = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${options.owner}/${options.repo}/issues`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token ' + options.accessToken,
            'User-Agent': options.owner
        }
    };
    return new Promise((resolve, reject) => {
        const req = http.request(params, (res) => {
            res.setEncoding('utf8');
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            });
            res.on('end', () => {
                if (JSON.parse(data).title === options.title) {
                    resolve(true)
                } else {
                    console.log('接口返回数据' + data)
                    resolve(false)
                }
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e)
        });
        req.write(postData);
        req.end();
    })
}
const search = function (options = { title, label, accessToken, repo, owner }) {
    const postData = qs.stringify({
        "labels": `Gitalk,${options.label}`
    });

    const params = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${options.owner}/${options.repo}/issues?${postData}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token ' + options.accessToken,
            'User-Agent': options.owner
        }
    };
    return new Promise((resolve, reject) => {
        const req = http.request(params, (res) => {
            res.setEncoding('utf8');
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            });
            res.on('end', () => {
                data = JSON.parse(data)
                if (!data) {
                    console.log("接口返回数据：" + JSON.stringify(data))
                    resolve(false)
                }
                else if (data.length >= 1) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e)
        });
        req.end();
    })
}
async function createGitalk(pages, options) {
    for (const v of pages) {
        let o = new Object();
        o.label = v.path
        o.title = v.title
        let has = await search({ ...options, ...o })
        if (!has) {
            console.log(v.title + ' 开始创建')
            let res = await create({ ...options, ...o })
            if (res) console.log(v.title + ' 创建成功')
            else console.log(v.title + ' 创建失败')
        }
        else console.log(v.title + ' 已存在')
    }
}

module.exports = createGitalk