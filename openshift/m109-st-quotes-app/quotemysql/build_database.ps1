$a = (kubectl get pods | select-string 'mysql') -match 'mysql([^\s]+)'; $podname = $matches[0]

kubectl cp ./create_database_quotesdb.sql ${podname}:/tmp/create_database_quotesdb.sql
kubectl cp ./create_database.sh ${podname}:/tmp/create_database.sh
kubectl exec deploy/mysql -- /bin/bash ./tmp/create_database.sh

kubectl cp ./create_table_quotes.sql ${podname}:/tmp/create_table_quotes.sql
kubectl cp ./create_tables.sh ${podname}:/tmp/create_tables.sh
kubectl exec deploy/mysql -- /bin/bash ./tmp/create_tables.sh

kubectl cp ./populate_table_quotes_POWERSHELL.sql ${podname}:/tmp/populate_table_quotes_POWERSHELL.sql
kubectl cp ./quotes.csv ${podname}:/tmp/quotes.csv
kubectl cp ./populate_tables_POWERSHELL.sh ${podname}:/tmp/populate_tables_POWERSHELL.sh
kubectl exec deploy/mysql -- /bin/bash ./tmp/populate_tables_POWERSHELL.sh

kubectl cp ./query_table_quotes.sql ${podname}:/tmp/query_table_quotes.sql
kubectl cp ./query_table_quotes.sh ${podname}:/tmp/query_table_quotes.sh
kubectl exec deploy/mysql -- /bin/bash ./tmp/query_table_quotes.sh