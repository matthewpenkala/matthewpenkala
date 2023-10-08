var structuredData = {
    schema: {
        videoobject: {
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            'name': 'Matthew Penkala | Motion GFX Reel (Early 2021 \u2013 Early 2022)',
            'description': "Explore the dynamic world of motion graphics and visual effects through Matthew Penkala's supereminent reel. Discover stunning visuals and seamless animations that showcase his expertise in this evolving realm. Dive into a creative journey that combines artistic vision with technical finesse, all curated in one unparalleled video reel. Experience the éclat of motion design at its finest with Matthew Penkala.",
            'thumbnailUrl': 'https://src.matthewpenkala.com/assets/MTP-SV_REEL.jpg',
            'uploadDate': '2022-12-01',
            'duration': 'PT2M56S'
        }
    },
    init: function () {
        var g = [];
        var sd = structuredData;
        g.push(sd.schema.videoobject);
        // etc. {g.push(sd.schema.`[…]`);}

        var o = document.createElement('script');
        o.type = 'application/ld+json';
        o.innerHTML = JSON.stringify(g);
        var d = document;
        (d.head || d.body).appendChild(o);
    }
};

structuredData.init();
