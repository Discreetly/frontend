export async function get(baseUrl: string, endpoint: string) {
    const res = await fetch(
        `${baseUrl}${endpoint}`, 
        {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
    );
    if (res.ok) {
        return res.json();
    }
    throw new Error(`Failed to fetch ${endpoint}`);
}

export async function post(baseUrl: string, endpoint: string, data: any) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (res.ok) {
        return res.json();
    } else {
        throw new Error(`Failed to post to ${endpoint}`);
    }
}
