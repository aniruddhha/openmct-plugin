const CustomPlugIn = () => (om) => {
    console.log('hello world')
    console.log(om)

    om.objects.addRoot({
        namespace: 'com.aniruddha.kudalkar',
        key: 'github'
    })

    openmct.objects.addProvider('com.aniruddha.kudalkar', objectProvider);
    openmct.composition.addProvider(compositionProvider)

    openmct.types.addType('com.aniruddha.kudalkar', {
        name: 'Example Telemetry Point',
        description: 'Example telemetry point from our happy tutorial.',
        cssClass: 'icon-telemetry'
    });
}

const objectProvider = {
    get: async identifier => {
        if (identifier.key === 'github') {
            return fetch('/dictionary.json').then(res => res.json()).then(dc => {
                return {
                    identifier: identifier,
                    name: dc.name,
                    type: 'folder',
                    location: 'ROOT'
                }
            })
        } else {
            return fetch('/dictionary.json')
                .then(res => res.json())
                .then(dc => {
                    const measurement = dc.measurements.filter(m => {
                        return m.key === identifier.key;
                    })[0];
                    return {
                        identifier: identifier,
                        name: measurement.name,
                        type: 'user',
                        telemetry: {
                            values: measurement.values
                        },
                        location: 'com.aniruddha.kudalkar:github'
                    }
                })

        }
    }
}

const compositionProvider = {
    appliesTo: domainObject => {
        console.log(domainObject)
        return domainObject.identifier.namespace === 'com.aniruddha.kudalkar' && domainObject.type === 'folder'
    },
    load: domainObject => fetch('/dictionary.json').then(res => res.json()).then(dc => {
        return dc.measurements.map(function (m) {
            return {
                namespace: 'com.aniruddha.kudalkar',
                key: m.key
            };
        });
    })
}
