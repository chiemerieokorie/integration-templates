import { createSync } from 'nango';
import type { GemApplication } from '../types.js';
import { toAtsApplication } from '../mappers/to-ats-application.js';
import { AtsApplication } from '../../shared/models/ats/ats-application.js';

const sync = createSync({
    description: 'Fetches applications from Gem and maps them to the standard ATS application model',
    version: '1.0.0',
    frequency: 'every 6 hours',
    autoStart: true,
    syncType: 'incremental',

    endpoints: [
        {
            method: 'GET',
            path: '/ats/applications',
            group: 'Unified ATS'
        }
    ],

    models: {
        AtsApplication: AtsApplication
    },

    exec: async (nango) => {
        for await (const applications of nango.paginate<GemApplication>({
            // https://api.gem.com/ats/v0/reference#tag/Application/paths/~1ats~1v0~1applications~1/get
            endpoint: '/ats/v0/applications',
            paginate: {
                type: 'offset',
                offset_name_in_request: 'page',
                offset_start_value: 1,
                limit_name_in_request: 'per_page',
                limit: 100
            },
            params: {
                include_deleted: 'true',
                ...(nango.lastSyncDate && { last_activity_after: nango.lastSyncDate.toISOString() })
            },
            retries: 3
        })) {
            const mapped = applications.map(toAtsApplication);
            const deleted = mapped.filter((a) => (a.providerSpecific as any)?.deleted_at);
            const active = mapped.filter((a) => !(a.providerSpecific as any)?.deleted_at);

            if (deleted.length > 0) {
                await nango.batchDelete(deleted, 'AtsApplication');
            }
            if (active.length > 0) {
                await nango.batchSave(active, 'AtsApplication');
            }
        }
    }
});

export type NangoSyncLocal = Parameters<(typeof sync)['exec']>[0];
export default sync;
