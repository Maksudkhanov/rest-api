export function paginateItems(items: any[]) {
	return (page: number, limit: number) => {
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const results: any = {};

		if (endIndex < items.length) {
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit,
			};
		}

		results.results = items.slice(startIndex, endIndex);

		return results;
	};
}
