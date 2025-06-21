// @ts-check
import html from 'html-template-tag';

export default function packingSlipTemplate(order: {
	id: string;
	customer_first_name: string;
	customer_last_name: string;
	customer_note?: string;
	items: Array<{
		name: string;
		quantity: number;
	}>;
}) {
	return html`
		<html>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&display=swap"
					rel="stylesheet" />
			</head>

			<body>
				<header>
					<h1>Order ${order.id}</h1>
					<p class="name">${order.customer_first_name} ${order.customer_last_name}</p>
					<table class="item-table">
						<thead>
							<tr>
								<td>Item Name</td>
								<td>Qty</td>
							</tr>
						</thead>
						<tbody>
							${order.items.map(
								(item) =>
									html`<tr>
										<td class="item-name">${item.name}</td>
										<td class="item-quantity">${String(item.quantity)}</td>
									</tr>`
							)}
						</tbody>
					</table>
					${order.customer_note
						? [
								html`<div>
									<h2>Customer Note</h2>
									<pre class="note">${order.customer_note}</pre>
								</div>`,
						  ]
						: ''}
				</header>
				<style>
					@layer base, components, utilities;

					@layer base {
						html {
							font-family: 'Open Sans';
							box-sizing: border-box;
							font-size: 12px;
						}

						body {
							font-size: 1rem;
							padding: 1rem;
						}

						* {
							box-sizing: inherit;
							font-size: inherit;
						}

						p {
							margin: 0;
						}

						h1 {
							font-size: 1.4rem;
							font-weight: 600;
						}

						h2 {
							font-size: 1.1rem;
							font-weight: 500;
						}

						pre {
							font-family: inherit;
						}
					}

					@layer components {
						.name {
							font-weight: 500;
							font-size: 110%;
						}

						.item-table {
							font-size: 90%;
							width: 100%;
							margin-block: 1rem;
							font-family: monospace;

							& td {
								padding: 0.3rem;
							}

							& thead {
								font-weight: 600;
							}

							& tbody {
								outline: 2px solid black;
							}

							& tbody tr {
								margin: 1rem;
							}

							& tbody tr:nth-child(odd) td {
								outline: 1px solid black;
								border: 1px solid black;
							}

							& tbody tr:nth-child(even) td {
								border: 2px dotted black;
							}
						}

						.item-list {
							border: 1px solid #333;
							list-style-type: none;
							padding-left: 0px;

							& li {
							}

							& li:not(:last-child) {
								border-bottom: 1px solid #333;
							}

							& li .item-name {
							}
						}
					}

					@layer utilities {
						.medium {
							font-weight: 500;
						}
					}
				</style>
			</body>
		</html>
	`;
}
