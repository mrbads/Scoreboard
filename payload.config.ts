import {buildConfig, CollectionConfig, GlobalConfig} from "payload";
import {mongooseAdapter} from "@payloadcms/db-mongodb";
import {Media} from "@/collections/Media";

const Sponsors: CollectionConfig = {
    slug: 'sponsors',
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
    ],
};

const Scoreboard: GlobalConfig = {
    slug: 'scoreboard',
    fields: [
        {
            name: 'teamAScore',
            type: 'number',
            required: true,
            defaultValue: 0,
        },
        {
            name: 'teamBScore',
            type: 'number',
            required: true,
            defaultValue: 0,
        },
        {
            name: 'wedstrijdcode',
            type: 'text',
            required: false,
        }
    ],
}

export default buildConfig({
    serverURL: 'http://localhost:3000',
    collections: [Media, Sponsors],
    globals: [Scoreboard],
    secret: process.env.PAYLOAD_SECRET || '',
    db: mongooseAdapter({
        url: process.env.DATABASE_URI || '',
    })
})