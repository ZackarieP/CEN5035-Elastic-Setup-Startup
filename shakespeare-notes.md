Importing Shakespeare Data

#create mapping
curl -H "Content-Type: application/json" -XPUT 127.0.0.1:9200/shakespeare --data-binary @shakes-mapping.json
curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -XPUT -H "Content-Type: application/json" https://localhost:9200/shakespeare/\_mapping -d @shakes-mapping.json
curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -XPUT -H "Content-Type: application/json" https://localhost:9200/shakespeare

# Index/import data to Elasticsearch

curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -H "Content-Type: application/json" -XPUT 'https://127.0.0.1:9200/shakespeare/_bulk' --data-binary @shakespeare_8.0.json

# Try searching a phrase

curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -H "Content-Type: application/json" -XGET 'https://127.0.0.1:9200/shakespeare/_search?pretty' -d '
{
"query" : {
"match_phrase" : {
"text_entry" : "to be or not to be"
}
}
}'

curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -H "Content-Type: application/json" -XGET 'https://127.0.0.1:9200/shakespeare/_search?pretty' -d '
{
"query": {
"match_phrase": {
"play_name": "Hamlet"
}
}
}'

# Ingesting data and mapping

curl -H "Content-Type: application/json" -H SS1xbEVZa0J0aTM5bXFYWXpyWkg6amdtZ1d4MmFROFNtX2xOaERfckRNdw== \
-XPUT https://my-deployment-11964c.kb.eastus.azure.elastic-cloud.com/shakespeare/ --data-binary @shakes-mapping.json

curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -H "Content-Type: application/json" -XPUT '127.0.0.1:9200/shakespeare/\_bulk' --data-binary @shakespeare_8.0.json

curl -H "Content-Type: application/json" -H SS1xbEVZa0J0aTM5bXFYWXpyWkg6amdtZ1d4MmFROFNtX2xOaERfckRNdw== \
-XPUT https://my-deployment-11964c.kb.eastus.azure.elastic-cloud.com/shakespeare/_bulk --data-binary @shakespeare_8.0.json

curl --cacert http_ca.crt -u elastic:KS-FdKV4doqZ2dnq4N_z -H "Content-Type: application/json" -XGET 'https://127.0.0.1:9200/shakespeare/_search?pretty' -d '
{
"query": {
"match_phrase": {
"play_name": "Hamlet"
}
}
}'
