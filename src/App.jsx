const sampleProducts = [
  {
    id: 1,
    name: 'T-shirt basique',
    price: 19.99,
    description: 'Un indispensable léger et confortable.',
    badge: 'Nouveau',
  },
  {
    id: 2,
    name: 'Sneakers quotidiennes',
    price: 59.99,
    description: 'Idéales pour la marche ou le bureau.',
    badge: 'Populaire',
  },
  {
    id: 3,
    name: 'Sac compact',
    price: 34.99,
    description: 'Parfait pour transporter vos essentiels.',
    badge: 'En promo',
  },
];

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <header className="product-card__header">
        <p className="product-card__badge">{product.badge}</p>
        <h3 className="product-card__title">{product.name}</h3>
      </header>
      <p className="product-card__description">{product.description}</p>
      <p className="product-card__price">{product.price.toFixed(2)} €</p>
      <button className="button">Ajouter au panier</button>
    </article>
  );
}

function App() {
  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Bienvenue</p>
        <h1>Une base e-commerce simple en React</h1>
        <p className="subtitle">
          On part des mêmes principes que la version mobile : des composants lisibles
          et un design épuré pour progresser pas à pas.
        </p>
        <div className="hero__actions">
          <button className="button button--primary">Découvrir la boutique</button>
          <button className="button button--ghost">Voir le panier</button>
        </div>
      </header>

      <main className="content">
        <section className="section">
          <header className="section__header">
            <p className="eyebrow">Catalogue</p>
            <h2>Produits en vedette</h2>
          </header>
          <div className="grid">
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="section section--muted">
          <div>
            <p className="eyebrow">Progression</p>
            <h2>Construisons étape par étape</h2>
            <p className="subtitle">
              Cette base réutilise la simplicité du projet React Native : quelques
              composants réutilisables, des couleurs légères et une mise en page
              centrée sur le contenu. Nous pourrons ensuite ajouter la navigation,
              un panier et la connexion utilisateur.
            </p>
          </div>
          <div className="callout">
            <strong>Astuce débutant :</strong> modifiez ce fichier <code>src/App.jsx</code>
            pour tester vos idées. La structure reste volontairement minimale.
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
