#!/bin/sh

set -e

if [ ! -z "$SPRING_CLOUD_CONFIG_LABEL" ]; then
        ENDPOINT="$ENDPOINT/$SPRING_CLOUD_CONFIG_LABEL"
fi

curl --fail -s $ENDPOINT/tori-validator${PROFILE}.json -o config.json
cat config.json

for KEY in $(jq -r '[paths | join(".")]'  config.json)
do        
        if [ "$KEY" != "[" ] && [ "$KEY" != "]" ]
        then
                TRIMMED_KEY=$(echo $KEY | cut -d'"' -f 2)
                IS_OBJECT=$(jq '.'"$TRIMMED_KEY"' | if type=="object" then "yes" else "no" end' config.json)

                if [ $IS_OBJECT == "\"no\"" ]
                then
                        PLACE_HOLDER=#{$TRIMMED_KEY}
                        VALUE=$(jq '.'"$TRIMMED_KEY" config.json | cut -d'"' -f 2)
                        echo $TRIMMED_KEY": "$VALUE

                        #replace / to \/ so the next sed step can use it
                        VALUE=$(echo $VALUE | sed 's/\//\\\//g')                        
                       $(find ./ -type f -exec sed -i 's/'"$PLACE_HOLDER"'/'"$VALUE"'/gI' {} \;)
                fi
        fi
done

echo "finish"
exec "$@"
