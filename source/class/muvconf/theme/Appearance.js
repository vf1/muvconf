/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("muvconf.theme.Appearance",
{
  extend : qx.theme.indigo.Appearance,

  appearances :
  {
    "window/icon" :
    {
      style : function(states)
      {
        return {
          marginTop : 4,
          marginRight : 4
        };
      }
    }
  }
});