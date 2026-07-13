
class Solution{
    public String removeSpaces(String s){
        StringBuilder sb = new StringBuilder();
        for(int i=0; i<s.length(); i++){
            if(s.charAt(i) != ' '){
                sb.append(s.charAt(i));
            }
        }
        return sb.toString();
    }
}

class Solution{
    public boolean isPalindrome(String s){
        StringBuilder sn= removeSpaces(s).toLowerCase();
        for(char c:s.toCharArray()){
            if(Character.isLetterOrDigit(c)){
                sb.append(Character.toLowerCase(c));
            }
        }
        String cleaned=sb.toStrin();
        return cleaned.equals(sb.reverse().toString());
    }
}