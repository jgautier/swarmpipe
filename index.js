const swarm = require('discovery-swarm');
const hypercore = require('hypercore');
const ram = require('random-access-memory');
const defaults = require('dat-swarm-defaults');
const feedKey = process.argv[2];
const feed = hypercore((filename) => {
    return ram();
}, feedKey);
feed.ready(() => {
    const sw = swarm(defaults({
        stream: function () {
            return feed.replicate({
                live: true
            });
        }
    }));
    sw.listen();
    sw.join(feed.discoveryKey);
    if (feedKey) {
        feed.createReadStream({live: true, start: 0}).pipe(process.stdout);
    } else {
        process.stdin.pipe(feed.createWriteStream());
    }
    process.stderr.write(feed.key.toString('hex') + '\n');
});
