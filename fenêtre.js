fenêtre.PayPal
  .Boutons({
    Style : {
      forme : « rect »,
      mise en page : « vertical »,
    },
    async createOrder() {
      essayer {
        const response = await fetch(« /api/orders », {
          méthode : « POST »,
          En-têtes : {
            « Content-Type » : « application/json »,
          },
          Utilisez le paramètre « body » pour transmettre éventuellement des informations de commande supplémentaires
          Comme les identifiants et les quantités de produits
          corps : JSON.Stringify (en anglais seulement)({
            Panier : [
              {
                id : « YOUR_PRODUCT_ID »,
                quantité : « YOUR_PRODUCT_QUANTITY »,
              },
            ],
          }),
        });

        const orderData = attendre la réponse.json (en anglais seulement)();

        if (orderData.id) {
          return orderData.id;
        } autre {
          const errorDetail = orderData ?.détails ?.[0];
          const errorMessage = errorDetail
            ? '${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);

          throw new Error(errorMessage);
        }
      } catch (erreur) {
        la console.error(erreur);
        resultMessage('Impossible de lancer PayPal Checkout... <br><br>${erreur}`);
      }
    },
    async onApprove(données, actions) {
      essayer {
        const response = await fetch('/api/orders/${data.orderID}/capture', {
          méthode : « POST »,
          En-têtes : {
            « Content-Type » : « application/json »,
          },
        });

        const orderData = attendre la réponse.json (en anglais seulement)();
        Trois cas à traiter :
        (1) Récupérable INSTRUMENT_DECLINED -> appel actions.restart()
        (2) Autres erreurs non récupérables -> Afficher un message d’échec
        (3) Transaction réussie -> Afficher un message de confirmation ou de remerciement

        const errorDetail = orderData ?.détails ?.[0];

        if (errorDetail ?.problème === « INSTRUMENT_DECLINED ») {
          (1) Récupérable INSTRUMENT_DECLINED -> appel actions.restart()
          État récupérable, par https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          actions de retour.redémarrer();
        } else if (errorDetail) {
          (2) Autres erreurs non récupérables -> Afficher un message d’échec
          throw new Error('${errorDetail.description} (${orderData.debug_id})`);
        } sinon si ( !orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } autre {
          (3) Transaction réussie -> Afficher un message de confirmation ou de remerciement
          Ou allez à une autre URL : actions.redirect('thank_you.html') ;
          const transaction (en anglais seulement) =
 orderData ?.purchase_units ?.[0] ?.paiements ?.captures ?.[0] ||
 orderData ?.purchase_units ?.[0] ?.paiements ?.autorisations ?.[0];
          resultMessage(
            `Transaction ${transaction.status} : ${transaction.id}<br><br>Voir la console pour tous les détails disponibles',
          );
          la console.rapport(
            « Capturer le résultat »,
            orderData,
            JSON.stringify(orderData, null, 2),  
          );
        }
      } catch (erreur) {
        la console.error(erreur);
        resultMessage(
          `Désolé, votre transaction n’a pas pu être traitée... <br><br>${erreur}',
        );
      }
    },
  })
  .render(« #PayPal-button-container »);

Exemple de fonction pour afficher un résultat à l’utilisateur. La bibliothèque d’interface utilisateur de votre site peut être utilisée à la place.
function resultMessage(message) {
  const container = document.querySelector(« #result-message »);
 conteneur.innerHTML = message;
}