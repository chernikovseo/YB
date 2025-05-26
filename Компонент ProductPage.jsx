// Компонент ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // Для управления <head>
import { useRouter } from 'next/router'; // Для SSR/SSG (в CSR используйте window.location)

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Имитация загрузки данных
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductData(router.query.id);
      setProduct(data);
      setLoading(false);
    };
    fetchData();
  }, [router.query.id]);

  if (loading) return <div>Загрузка...</div>;

  const productUrl = `https://nerzhaveika.ru/products/ ${product.slug}`;
  const imageUrl = product.image;

  return (
    <>
      {/* SEO-метатеги */}
      <Helmet>
        {/* Основные метатеги */}
        <title>{product.name} | Нержавейка.РУ</title>
        <meta name="description" content={`Купить ${product.name} в Москве по цене от ${product.priceMin} ₽. ${product.description}`} />
        <meta name="keywords" content={`купить ${product.name}, нержавеющая полоса, ${product.material}, ${product.brand}, ${product.size}, ${product.category}`} />
        
        {/* Open Graph для соцсетей */}
        <meta property="og:title" content={`${product.name} | Нержавейка.РУ`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:type" content="product" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Нержавейка.РУ`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Canonical URL */}
        <link rel="canonical" href={productUrl} />

        {/* Pagination для SEO */}
        {product.prevPage && <link rel="prev" href={product.prevPage} />}
        {product.nextPage && <link rel="next" href={product.nextPage} />}
      </Helmet>

      {/* Микроразметка schema.org (JSON-LD) */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org ",
            "@type": "Product",
            "name": "${product.name}",
            "description": "${product.description}",
            "image": "${imageUrl}",
            "sku": "${product.sku}",
            "brand": {
              "@type": "Brand",
              "name": "${product.brand}"
            },
            "offers": {
              "@type": "Offer",
              "price": "${product.priceMin}",
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock "
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "120"
            },
            "category": "${product.category}",
            "manufacturer": "${product.manufacturer}"
          }
        `}
      </script>

      {/* Хлебные крошки */}
      <nav aria-label="Breadcrumb">
        <ol itemscope itemtype="https://schema.org/BreadcrumbList ">
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem ">
            <a href="/" itemprop="item"><span itemprop="name">Главная</span></a>
          </li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem ">
            <a href="/products" itemprop="item"><span itemprop="name">Каталог</span></a>
          </li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem ">
            <span itemprop="name">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Карточка товара */}
      <article className="product-card" itemscope itemtype="https://schema.org/Product ">
        <header className="product-header">
          <h1 itemprop="name">{product.name}</h1>
        </header>
        
        <div className="product-image">
          <img 
            src={imageUrl} 
            alt={product.name}
            title={`Фото 1: ${product.name}, ${product.material}, ${product.size}`}
            loading="lazy"
            decoding="async"
            aria-label={`Изображение товара: ${product.name}`}
            srcSet={`
              ${imageUrl} 1x,
              ${product.image2x} 2x
            `}
            sizes="(max-width: 600px) 100vw, 50vw"
          />
        </div>

        <div className="product-info">
          <p itemprop="description">{product.description}</p>
          
          {/* Цены */}
          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer ">
            <div className="prices">
              <span itemprop="price" content={product.priceMin}>{product.priceMin} ₽/кг</span>
              <span itemprop="price" content={product.priceTon}>{product.priceTon} ₽/тн</span>
              <meta itemprop="priceCurrency" content="RUB" />
              <link itemprop="availability" href="https://schema.org/InStock " />
            </div>
          </div>

          {/* Характеристики */}
          <div className="product-specs" aria-label="Характеристики товара">
            <h2>Характеристики</h2>
            <ul>
              <li><strong>Марка стали:</strong> <span itemprop="material">${product.material}</span></li>
              <li><strong>Толщина:</strong> <span itemprop="thickness">${product.thickness} мм</span></li>
              <li><strong>Размер:</strong> <span itemprop="size">${product.size}</span></li>
              <li><strong>Вес:</strong> <span itemprop="weight">${product.weight} кг</span></li>
            </ul>
          </div>

          {/* Кнопка добавления в корзину */}
          <button 
            className="add-to-cart" 
            onClick={() => addToCart(product.id)}
            aria-label={`Добавить ${product.name} в корзину`}
          >
            Добавить в корзину
          </button>
        </div>
      </article>

      {/* Отзывы клиентов */}
      <section className="reviews" aria-label="Отзывы клиентов">
        <h2>Отзывы клиентов</h2>
        {product.reviews.map((review, index) => (
          <div key={index} itemscope itemtype="https://schema.org/Review ">
            <h3 itemprop="name">{review.title}</h3>
            <p itemprop="reviewBody">{review.body}</p>
            <div itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating ">
              <meta itemprop="ratingValue" content={review.rating} />
              <meta itemprop="bestRating" content="5" />
            </div>
          </div>
        ))}
      </section>

      {/* Блок вопросов и ответов */}
      <section className="faq" aria-label="Часто задаваемые вопросы">
        <h2>Вопросы и ответы</h2>
        <div itemscope itemtype="https://schema.org/FAQPage ">
          {product.faq.map((item, index) => (
            <div key={index} itemscope itemprop="mainEntity" itemtype="https://schema.org/Question ">
              <h3 itemprop="name">{item.question}</h3>
              <div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer ">
                <p itemprop="text">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Адреса филиалов */}
      <section className="branches" aria-label="Адреса филиалов">
        <h2>Адреса наших филиалов</h2>
        {product.branches.map((branch, index) => (
          <div key={index} itemscope itemtype="https://schema.org/Organization ">
            <p itemprop="address">{branch.address}</p>
            <p itemprop="telephone">{branch.phone}</p>
          </div>
        ))}
      </section>

      {/* Рекомендуемые товары */}
      <section className="recommended-products" aria-label="Рекомендуемые товары">
        <h2>Рекомендуем также</h2>
        <ul>
          {product.recommendedProducts.map(recommended => (
            <li key={recommended.id}>
              <a href={`/products/${recommended.slug}`} aria-label={`Подробнее о ${recommended.name}`}>
                {recommended.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Сервисы и доставка */}
      <section className="services" aria-label="Услуги и доставка">
        <h2>Дополнительные услуги</h2>
        <ul>
          <li>Резка металла</li>
          <li>Шлифование</li>
          <li>Доставка по РФ</li>
        </ul>
      </section>

      {/* Правила оплаты и доставки */}
      <section className="payment-delivery" aria-label="Оплата и доставка">
        <h2>Оплата и доставка</h2>
        <div itemscope itemtype="https://schema.org/Organization ">
          <p itemprop="description">Оплата для юридических лиц: по счёту, бизнес-картой, online. Для физических лиц: картой, наличными, online.</p>
          <p itemprop="address">Склад работает: пн-чт 9.00-17:00, пт 9.00-16:30.</p>
        </div>
      </section>
    </>
  );
};

export default ProductPage;