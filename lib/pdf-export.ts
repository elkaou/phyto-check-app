import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import { InventoryItem } from '@/lib/types';

export async function generateStockPDF(
  inventory: InventoryItem[],
  retiredProducts: InventoryItem[],
  authorizedProducts: InventoryItem[]
): Promise<string> {
  const cmrProducts = inventory.filter(item => item.isCMR === true);
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Générer le HTML pour le PDF
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11px;
      line-height: 1.4;
      color: #1a1a1a;
      padding: 20px;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 3px solid #0a7ea4;
    }
    
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #0a7ea4;
      margin-bottom: 5px;
    }
    
    .subtitle {
      font-size: 13px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .export-info {
      font-size: 10px;
      color: #888;
    }
    
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #0a7ea4;
    }
    
    .stat-label {
      font-size: 10px;
      color: #666;
      margin-top: 3px;
    }
    
    .section {
      margin: 25px 0;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e5e5e5;
    }
    
    .section-title.retired {
      color: #dc2626;
    }
    
    .section-title.authorized {
      color: #16a34a;
    }
    
    .section-title.cmr {
      color: #ea580c;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    th {
      background: #f5f5f5;
      padding: 8px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
      border-bottom: 2px solid #ddd;
    }
    
    td {
      padding: 8px;
      border-bottom: 1px solid #eee;
      font-size: 10px;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .product-name {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .official-name {
      font-size: 9px;
      color: #666;
      font-style: italic;
    }
    
    .amm {
      font-family: 'Courier New', monospace;
      color: #0a7ea4;
      font-size: 9px;
    }
    
    .quantity {
      text-align: right;
      font-weight: 600;
    }
    
    .cmr-badge {
      display: inline-block;
      background: #fed7aa;
      color: #9a3412;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 8px;
      font-weight: bold;
      margin-left: 5px;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 2px solid #e5e5e5;
      font-size: 9px;
      color: #888;
      text-align: center;
    }
    
    .empty-message {
      text-align: center;
      color: #999;
      padding: 20px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">📦 PhytoCheck</div>
    <div class="subtitle">Rapport de Gestion du Stock</div>
    <div class="export-info">Généré le ${dateStr} à ${timeStr}</div>
  </div>
  
  <div class="stats">
    <div class="stat-item">
      <div class="stat-value">${inventory.length}</div>
      <div class="stat-label">TOTAL PRODUITS</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color: #16a34a;">${authorizedProducts.length}</div>
      <div class="stat-label">AUTORISÉS</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color: #dc2626;">${retiredProducts.length}</div>
      <div class="stat-label">PPNU</div>
    </div>
    <div class="stat-item">
      <div class="stat-value" style="color: #ea580c;">${cmrProducts.length}</div>
      <div class="stat-label">CMR</div>
    </div>
  </div>
  
  ${retiredProducts.length > 0 ? `
  <div class="section">
    <div class="section-title retired">⚠️ Produits PPNU (Non Utilisables)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 40%;">Produit</th>
          <th style="width: 25%;">N° AMM</th>
          <th style="width: 20%;">Quantité</th>
          <th style="width: 15%;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${retiredProducts.map(item => `
          <tr>
            <td>
              <div class="product-name">
                ${item.commercialName || item.name}
                ${item.isCMR ? '<span class="cmr-badge">CMR</span>' : ''}
              </div>
              ${item.commercialName && item.commercialName !== item.name ? `
                <div class="official-name">${item.name}</div>
              ` : ''}
            </td>
            <td><span class="amm">${item.amm}</span></td>
            <td class="quantity">${item.quantity || '-'} ${item.unit || ''}</td>
            <td style="color: #dc2626; font-weight: 600;">PPNU</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${authorizedProducts.length > 0 ? `
  <div class="section">
    <div class="section-title authorized">✓ Produits Autorisés</div>
    <table>
      <thead>
        <tr>
          <th style="width: 40%;">Produit</th>
          <th style="width: 25%;">N° AMM</th>
          <th style="width: 20%;">Quantité</th>
          <th style="width: 15%;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${authorizedProducts.map(item => `
          <tr>
            <td>
              <div class="product-name">
                ${item.commercialName || item.name}
                ${item.isCMR ? '<span class="cmr-badge">CMR</span>' : ''}
              </div>
              ${item.commercialName && item.commercialName !== item.name ? `
                <div class="official-name">${item.name}</div>
              ` : ''}
            </td>
            <td><span class="amm">${item.amm}</span></td>
            <td class="quantity">${item.quantity || '-'} ${item.unit || ''}</td>
            <td style="color: #16a34a; font-weight: 600;">AUTORISÉ</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${cmrProducts.length > 0 ? `
  <div class="section">
    <div class="section-title cmr">⚠️ Produits CMR (Cancérogène/Mutagène/Reprotoxique)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 40%;">Produit</th>
          <th style="width: 25%;">N° AMM</th>
          <th style="width: 20%;">Quantité</th>
          <th style="width: 15%;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${cmrProducts.map(item => `
          <tr>
            <td>
              <div class="product-name">
                ${item.commercialName || item.name}
                <span class="cmr-badge">CMR</span>
              </div>
              ${item.commercialName && item.commercialName !== item.name ? `
                <div class="official-name">${item.name}</div>
              ` : ''}
            </td>
            <td><span class="amm">${item.amm}</span></td>
            <td class="quantity">${item.quantity || '-'} ${item.unit || ''}</td>
            <td style="color: ${item.status === 'RETIRED' ? '#dc2626' : '#16a34a'}; font-weight: 600;">
              ${item.status === 'RETIRED' ? 'PPNU' : 'AUTORISÉ'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${inventory.length === 0 ? `
    <div class="empty-message">
      Aucun produit dans le stock
    </div>
  ` : ''}
  
  <div class="footer">
    <p><strong>PhytoCheck</strong> - Application de vérification d'homologation des produits phytosanitaires</p>
    <p style="margin-top: 5px;">Base de données E-Phy mise à jour le 21/01/2026 - 15 042 produits référencés</p>
    <p style="margin-top: 5px;">Ce document est généré automatiquement et ne constitue pas un document officiel.</p>
  </div>
</body>
</html>
  `;

  // Générer le PDF
  const { uri } = await Print.printToFileAsync({ html });
  
  // Créer un nom de fichier avec la date
  const filename = `PhytoCheck_Stock_${dateStr.replace(/\//g, '-')}_${timeStr.replace(/:/g, 'h')}.pdf`;
  const newPath = `${FileSystem.documentDirectory}${filename}`;
  
  // Déplacer le fichier vers un emplacement permanent
  await FileSystem.moveAsync({
    from: uri,
    to: newPath,
  });
  
  return newPath;
}
