import html from 'html-template-tag';
import { loadImage } from '../src/template-lib';

export default function labelTemplate(address: {
  name: string;
  address1: string,
  address2: string,
  city: string;
  state: string;
  zip: string;
  country: string;
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
				<div>
					<img src="${loadImage('returnaddress.png')}" width="200" />
					<div class="address">
						<p class="medium">${address.name}</p>
						<p>${address.address1}</p>
						<p>${address.address2}</p>
						<p>${address.city}, ${address.state} ${address.zip}</p>
						<p>${address.country}</p>
					</div>
				</div>
				<style>
					@layer base, components, utilities;

					@layer base {
						p {
							margin: 0;
						}
					}

					@layer components {
						.address {
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							text-align: center;
							font: 400 1rem 'Open Sans';
							gap: 0;
							height: 15rem;
						}

						.image {
							width: 200px;
							position: absolute;
							top: 0;
							left: 0;
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
